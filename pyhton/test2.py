
from evdev import UInput, ecodes

ui = UInput()

for key in 'hello':
    ui.write(ecodes.EV_KEY, ecodes.ecodes['KEY_%s' % key.upper()], 1)
    ui.write(ecodes.EV_KEY, ecodes.ecodes['KEY_%s' % key.upper()], 0)

ui.syn()
input('Press enter to exit ... ')
ui.close()

