from evdev import uinput, ecodes as e

options = {
	'C' : e.KEY_C
}

def emitKey(key):
	with uinput.UInput() as ui:
		ui.write(e.EV_KEY, key, 1)
		ui.write(e.EV_KEY, key, 0)
		ui.syn()

key = input("press a key? ")

emitKey(options[key])

