import os
import tempfile
import time
import unittest
from unittest.mock import patch

temp = tempfile.TemporaryDirectory()
os.environ['STATS_DB'] = os.path.join(temp.name, 'stats.sqlite3')
os.environ['STATS_ADMIN_PATH'] = '/test-private-stats-path'
os.environ['STATS_ADMIN_PASSWORD'] = 'test-password-only-123456'
from app import app, database, lookup_token


class StatisticsTest(unittest.TestCase):
    def setUp(self):
        with database() as con:
            con.execute('DELETE FROM visits')
            con.execute('DELETE FROM ip_details')

    def test_lookup(self):
        client = app.test_client()
        ip = '8.8.8.8'
        client.post('/api/visits', json={}, headers={'X-Real-IP': ip})
        auth = ('admin', os.environ['STATS_ADMIN_PASSWORD'])
        body = {'ip': ip, 'token': lookup_token(ip)}
        with patch('app.urlopen') as upstream:
            upstream.return_value.__enter__.return_value.read.return_value = b'{"success":true,"country":"US","region":"California","city":"Mountain View","connection":{"isp":"Google LLC"}}'
            self.assertEqual(client.post('/test-private-stats-path', data=body).status_code, 401)
            self.assertEqual(client.post('/test-private-stats-path', data={'ip': ip}, auth=auth).status_code, 403)
            upstream.assert_not_called()
            client.get('/test-private-stats-path', auth=auth)
            for _ in range(2):
                self.assertEqual(client.post('/test-private-stats-path', data=body, auth=auth).status_code, 303)
            upstream.assert_called_once()
            result = client.get('/test-private-stats-path', auth=auth)
            self.assertIn(b'Google LLC', result.data)
            self.assertIn(b'Mountain View', result.data)

    def test_auto_refresh_limit_and_expiry(self):
        client = app.test_client()
        for ip in ('8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1', '9.9.9.9', '208.67.222.222'):
            client.post('/api/visits', json={}, headers={'X-Real-IP': ip})
        auth = ('admin', os.environ['STATS_ADMIN_PASSWORD'])
        with patch('app.urlopen') as upstream:
            upstream.return_value.__enter__.return_value.read.return_value = b'{"success":true,"country":"US","connection":{"isp":"Example"}}'
            client.get('/test-private-stats-path')
            client.get('/test-private-stats-path', auth=('admin', 'wrong'))
            upstream.assert_not_called()
            self.assertEqual(client.get('/test-private-stats-path', auth=auth).status_code, 200)
            self.assertEqual(upstream.call_count, 4)
            client.get('/test-private-stats-path', auth=auth)
            self.assertEqual(upstream.call_count, 6)
            client.get('/test-private-stats-path', auth=auth)
            self.assertEqual(upstream.call_count, 6)
            with database() as con:
                con.execute('UPDATE ip_details SET expires=0 WHERE ip=?', ('8.8.8.8',))
            client.get('/test-private-stats-path', auth=auth)
            self.assertEqual(upstream.call_count, 7)

    def test_lookup_failure(self):
        client = app.test_client()
        ip = '1.1.1.1'
        client.post('/api/visits', json={}, headers={'X-Real-IP': ip})
        auth = ('admin', os.environ['STATS_ADMIN_PASSWORD'])
        with patch('app.urlopen', side_effect=TimeoutError) as upstream:
            for _ in range(2):
                self.assertEqual(client.post('/test-private-stats-path', data={'ip': ip, 'token': lookup_token(ip)}, auth=auth).status_code, 303)
            upstream.assert_called_once()
            self.assertEqual(client.get('/test-private-stats-path', auth=auth).status_code, 200)

    def test_flow(self):
        client = app.test_client()
        headers = {'X-Real-IP': '203.0.113.2'}
        with patch('app.time.time', return_value=time.time() - 30):
            token = client.post('/api/visits', json={}, headers=headers).json['id']
        for seconds in (20, 20, 10):
            self.assertEqual(client.post('/api/visits', json={'id': token, 'seconds': seconds}, headers=headers).status_code, 200)
        with database() as con:
            self.assertEqual(con.execute('SELECT seconds FROM visits WHERE id=?', (token,)).fetchone()[0], 20)
        self.assertEqual(client.get('/test-private-stats-path').status_code, 401)
        self.assertEqual(client.get('/test-private-stats-path', auth=('admin', 'bad')).status_code, 401)
        result = client.get('/test-private-stats-path', auth=('admin', os.environ['STATS_ADMIN_PASSWORD']))
        self.assertEqual(result.status_code, 200)
        self.assertIn(b'203.0.113.2', result.data)
        self.assertEqual(client.get('/admin').status_code, 404)
        self.assertEqual(client.post('/api/visits', json={'id': token, 'seconds': -1}, headers=headers).status_code, 400)
        self.assertEqual(client.post('/api/visits', json={'id': token, 'seconds': 25}, headers={'X-Real-IP': '203.0.113.3'}).status_code, 404)


if __name__ == '__main__':
    unittest.main()
