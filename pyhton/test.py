import time
from evdev import uinput, ecodes as e

	
while True:
	with uinput.UInput() as ui:
		ui.write(e.EV_KEY, e.KEY_R, 1)
		ui.write(e.EV_KEY, e.KEY_R, 0)
		ui.syn()
	time.sleep(0.01)