"""Compose original 6.4-second instrument studies; no remote services or samples."""
import math
import random
import wave
from array import array
from pathlib import Path
import argparse

RATE = 22050
DURATION = 6.4
random.seed(20261003)
OUT = Path(__file__).resolve().parents[1] / 'public/audio/instruments'
OUT.mkdir(parents=True, exist_ok=True)

def note(kind, frequency, length):
    count = int(length * RATE)
    result = []
    # Karplus-Strong: a damped vibrating string, rather than a generic oscillator.
    ring = [random.uniform(-1, 1) for _ in range(max(2, int(RATE / frequency)))]
    for i in range(count):
        t = i / RATE
        phase = 2 * math.pi * frequency * t
        release = min(1, max(0, (length - t) / .16))
        attack = min(1, t / .045)
        if kind == 'drum':
            value = math.sin(2*math.pi*(72*t + 32*.07*(1-math.exp(-t/.07))))*math.exp(-t*9)
            value += random.uniform(-1,1)*.14*math.exp(-t*35)
        elif kind == 'shaker':
            value = random.uniform(-1,1)*math.sin(math.pi*min(1,t/.2))**2*math.exp(-t*12)
        elif kind in ('string', 'guzheng'):
            j = i % len(ring)
            value = ring[j]
            ring[j] = .497*(ring[j]+ring[(j+1)%len(ring)])
            if kind == 'guzheng':
                value += .16*math.sin(phase*2)*math.exp(-t*4)+.08*math.sin(phase*3)*math.exp(-t*7)
        elif kind == 'erhu':
            bowed_phase = phase + .55*(1-math.cos(2*math.pi*4.8*t))*min(1,t/.25)
            value = sum(math.sin(bowed_phase*h)/(h**1.55) for h in range(1,9))
            value += random.uniform(-1,1)*.018
            value *= min(1,t/.12)*release*(.75+.08*math.sin(2*math.pi*1.2*t))
        elif kind in ('bell','xylophone','musicbox'):
            ratios = {'bell':[(1,1),(2.76,.42),(5.4,.17),(8.93,.07)],'xylophone':[(1,1),(3,.3),(6,.12)],'musicbox':[(1,1),(2,.24),(3,.12),(5,.04)]}[kind]
            decay = {'bell':2.2,'xylophone':5,'musicbox':3.3}[kind]
            value = sum(weight*math.sin(phase*ratio)*math.exp(-t*decay*(1+k*.45)) for k,(ratio,weight) in enumerate(ratios))
            value *= min(1,t/.003)
        else:
            # Brass has a bright harmonic spectrum; free reeds have paired beating reeds.
            vibrato = .003*math.sin(2*math.pi*5*t)*min(1,t/.2)
            if kind == 'trumpet':
                value = sum(math.sin(phase*h*(1+vibrato))/(h**1.2) for h in range(1,9))
                value *= attack*release*(.7+.3*math.sin(math.pi*t/length))
            else:
                value = sum((math.sin(phase*h)+math.sin(phase*h*1.004))/(2*h**1.6) for h in range(1,7))
                value *= attack*release*(.75+.15*math.sin(2*math.pi*2*t))
        result.append(value*release)
    return result

melody = [60,64,67,64,62,65,69,65,64,67,72,67]
def compose(scene, kind):
    audio = [0.0] * int(RATE * DURATION)
    events = []
    if kind in ('drum','shaker'):
        for beat in range(12): events.append((beat*.48,kind,100 if beat%3==0 else 145,.4,.4 if beat%3==0 else .25))
    elif kind == 'guzheng':
        for i,midi in enumerate([60,62,64,67,69,72,69,67,64,62,64,60]):
            events.append((i*.48,kind,440*2**((midi-69)/12),1.0,.27))
        for i,midi in enumerate([60,62,64,67,69]):
            events.append((4.75+i*.08,kind,440*2**((midi-69)/12),.8,.12))
    elif kind == 'erhu':
        for i,midi in enumerate([62,64,66,69,66,64,62,59]):
            events.append((i*.7,kind,440*2**((midi-69)/12),.8,.23))
    else:
        notes = melody if kind != 'musicbox' else [72,67,69,64,67,64,62,60,64,67,64,60]
        for i,midi in enumerate(notes):
            events.append((i*.48,kind,440*2**((midi-69)/12),.42 if kind in ('trumpet','accordion') else .9,.24))
            if kind == 'accordion':events.append((i*.48,kind,440*2**((midi-81)/12),.42,.07))
    for start,timbre,freq,length,volume in events:
        offset = int(start*RATE)
        for j,value in enumerate(note(timbre,freq,length)):
            if offset+j<len(audio):audio[offset+j]+=value*volume
    peak=max(abs(v) for v in audio)
    gain=min(1,.55/max(peak,.0001))
    pcm=array('h',(int(max(-1,min(1,v*gain))*32767) for v in audio))
    with wave.open(str(OUT/(scene+'.wav')),'wb') as file:
        file.setparams((1,2,RATE,0,'NONE','not compressed'))
        file.writeframes(pcm.tobytes())
    print(scene, DURATION)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--only', nargs='*')
    selected = parser.parse_args().only
    for scene,kind in [('music-soft-drum','drum'),('music-bell-ring','bell'),('music-shaker','shaker'),('music-xylophone','xylophone'),('music-pluck-string','string'),('music-trumpet','trumpet'),('music-accordion','accordion'),('music-bear-dance','guzheng'),('music-note-score','erhu'),('music-box-goodnight','musicbox')]:
        if selected is None or scene in selected:
            compose(scene,kind)
