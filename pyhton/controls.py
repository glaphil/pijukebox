# http://python-evdev.readthedocs.org/en/latest/apidoc.html

#import time
from evdev import uinput, ecodes as e

options = {
	'C' : e.KEY_C,
	'N' : e.KEY_N,
	'P' : e.KEY_P,
	'1' : e.KEY_KP1,
	'2' : e.KEY_KP2,
	'3' : e.KEY_KP3,
	'4' : e.KEY_KP4,
	'5' : e.KEY_KP5,
	'6' : e.KEY_KP6,
	'7' : e.KEY_KP7,
	'8' : e.KEY_KP8
}

def emitKey(key):
	with uinput.UInput() as ui:
		ui.write(e.EV_KEY, key, 1)
		ui.write(e.EV_KEY, key, 0)
		ui.syn()

key = input("press a key? ")

emitKey(options[key])


