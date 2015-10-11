import time

import uinput


events = (
    uinput.KEY_E,
    uinput.KEY_H,
    uinput.KEY_L,
    uinput.KEY_O,
    )

device = uinput.Device(events)
time.sleep(1) # This is required here only for demonstration
device.emit_click(uinput.KEY_H)
device.emit_click(uinput.KEY_E)
device.emit_click(uinput.KEY_L)
device.emit_click(uinput.KEY_L)
device.emit_click(uinput.KEY_O)
