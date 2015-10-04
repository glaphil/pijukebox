

import time
import uinput

def main():
    events = (
    uinput.KEY_C,
    uinput.KEY_N,
    uinput.KEY_P,
    uinput.KEY_1,
    uinput.KEY_2,
    uinput.KEY_3,
    uinput.KEY_4,
    uinput.KEY_5,
    uinput.KEY_6,
    uinput.KEY_7,
    uinput.KEY_8
    )

    options = {
        'C' : uinput.KEY_C,
#        N : uinput.KEY_N,
#        P : uinput.KEY_P,
#        1 : uinput.KEY_1,
#        2 : uinput.KEY_2,
#        3 : uinput.KEY_3,
#        4 : uinput.KEY_4,
#        5 : uinput.KEY_5,
#        6 : uinput.KEY_6,
#        7 : uinput.KEY_7,
        '8' : uinput.KEY_8
    }

    key = input("press a key? ")
    print(key)
 
    emitKey(options[key])

def emitKey(key):
    with uinput.Device(events) as device:
        #time.sleep(1)
        device.emit_click(key)
        
if __name__ == "__main__":
    main()




