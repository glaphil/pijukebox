import pigpio
import time  
import uinput

# buttons are wired from gpio pin, pulled up resistor (3.3V), to ground
# we detect falling edges

# pigpio use BCM numering

# set bounce time to avoid multiple press in microseconds
GLITCH_FILTER=50000

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

# dictionnary key: pins, value: key 
mappings = {
  INSERT_COIN: uinput.KEY_C,
  PREVIOUS: uinput.KEY_P,
  NEXT: uinput.KEY_N,
  STOP: uinput.KEY_S,
  SONG_1: uinput.KEY_KP1,
  SONG_2: uinput.KEY_KP2,
  SONG_3: uinput.KEY_KP3,
  SONG_4: uinput.KEY_KP4,
  SONG_5: uinput.KEY_KP5,
  SONG_6: uinput.KEY_KP6,
  SONG_7: uinput.KEY_KP7,
  SONG_8: uinput.KEY_KP8
}

callbacks = []

device = uinput.Device(keys)

# because GPIO.FALLING detect both failling and rising edge, need to set this variable to fix that issue
ignore_key_release_fix = False

pi = pigpio.pi() # Connect to local Pi.

def init_pin_mapping(pin):
  pi.set_pull_up_down(pin, pigpio.PUD_UP)   
  pi.set_mode(pin, pigpio.INPUT) 
  pi.set_glitch_filter(pin, GLITCH_FILTER)
  callbacks.append(pi.callback(pin, pigpio.EITHER_EDGE, emitKey))

def emitKey(gpio, level, tick):
  if level == 1: 
    print(mappings[gpio]," released")
    print("Rising edge detected at")
    device.emit(mappings[gpio],1) 
  else: 
    print(mappings[gpio]," pressed")                
    print("Falling edge detected at")
    device.emit(mappings[gpio],0)

try:  
  for pin in mappings.keys():
    print("map ",pin," to ",mappings[pin])
    init_pin_mapping(pin)
  while True:
    time.sleep(1)
except KeyboardInterrupt:
  for cb in callbacks:
    cb.cancel() # Cancel callback.
  pi.stop() # Disconnect from local Pi.
  

