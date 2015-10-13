import RPi.GPIO as GPIO
import time  
import uinput

# buttons are wired from gpio pin, pulled up resistor (3.3V), to ground
# we detect falling edges

# BCM numering
GPIO.setmode(GPIO.BCM)

# set bounce time to avoid multiple press
BOUNCE_TIME=200

# pins names / bcm gpio
INSERT_COIN = 4
PREVIOUS = 17
NEXT = 18
STOP = 27
SONG_1 = 6
SONG_2 = 12
SONG_3 = 13
SONG_4 = 16  
SONG_5 = 19
SONG_6 = 20
SONG_7 = 26
SONG_8 = 21

# keys press 
keys = {
  uinput.KEY_C,
  uinput.KEY_P,
  uinput.KEY_N,
  uinput.KEY_S,
  uinput.KEY_KP1,
  uinput.KEY_KP2,
  uinput.KEY_KP3,
  uinput.KEY_KP4,
  uinput.KEY_KP5,
  uinput.KEY_KP6,
  uinput.KEY_KP7,
  uinput.KEY_KP8
}

# mappings between pins and key press (tuples)
mappings = [
  (INSERT_COIN,uinput.KEY_C),
  (PREVIOUS, uinput.KEY_P),
  (NEXT, uinput.KEY_N),
  (STOP, uinput.KEY_S),
  (SONG_1, uinput.KEY_KP1),
  (SONG_2, uinput.KEY_KP2),
  (SONG_3, uinput.KEY_KP3),
  (SONG_4, uinput.KEY_KP4),
  (SONG_5, uinput.KEY_KP5),
  (SONG_6, uinput.KEY_KP6),
  (SONG_7, uinput.KEY_KP7),
  (SONG_8, uinput.KEY_KP8)
]

device = uinput.Device(keys)

def init_pin_mapping(pinKey):
  GPIO.setup(pinKey[0], GPIO.IN, pull_up_down=GPIO.PUD_UP)
  GPIO.add_event_detect(pinKey[0], GPIO.FALLING, callback=lambda x: emitKey(pinKey), bouncetime=BOUNCE_TIME) 

def emitKey(pinKey):
  print(pinKey[1]," pressed")
  device.emit_click(pinKey[1])

try:  
  for pinKey in mappings:
    print("map ",pinKey[0]," to ",pinKey[1])
    init_pin_mapping(pinKey)
  while True:
    time.sleep(1)
except KeyboardInterrupt:
  # clean up GPIO on CTRL+C exit  
  GPIO.cleanup()         

# clean up GPIO on normal exit  
GPIO.cleanup()