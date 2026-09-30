import os
import tempfile
import time
import unittest
from unittest.mock import patch

temp = tempfile.TemporaryDirectory()
os.environ['STATS_DB'] = os.path.join(temp.name, 'stats.sqlite3')
os.environ['STATS_ADMIN_PATH'] = '/test-private-stats-path'
os.environ['STATS_ADMIN_PASSWORD'] = 'test-password-only-123456'
from app import app, database


class StatisticsTest(unittest.TestCase):
    def test_flow(self):
        client = app.test_client()
        headers = {'X-Real-IP': '203.0.113.2'}
        with patch('app.time.time', return_value=time.time() - 30):
            token = client.post('/api/visits', json={}, headers=headers).json['id']
        for seconds in (20, 20, 10):
            self.assertEqual(client.post('/api/visits', json={'id': token, 'seconds': seconds}, headers=headers).status_code, 200)
        with database() as con:
            self.assertEqual(con.execute('SELECT seconds FROM visits').fetchone()[0], 20)
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
