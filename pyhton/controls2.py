import time
from evdev import uinput, ecodes as e

time.sleep(2)

with uinput.UInput() as ui:
	ui.write(e.EV_KEY, e.KEY_ENTER, 1)
	ui.write(e.EV_KEY, e.KEY_ENTER, 0)

	ui.write(e.EV_KEY, e.KEY_C, 1)
	ui.write(e.EV_KEY, e.KEY_C, 0)
	
	ui.syn()
