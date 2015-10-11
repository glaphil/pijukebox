import time
import uinput

device = uinput.Device([uinput.KEY_E])
time.sleep(1)
device.emit_click(uinput.KEY_E)
