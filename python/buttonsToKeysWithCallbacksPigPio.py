import pigpio
import time  
import uinput

# buttons are wired from gpio pin, pulled up resistor (3.3V), to ground
# we detect falling edges

# pigpio use BCM numering

# set bounce time to avoid multiple press in microseconds
GLITCH_FILTER=50000

# set duration of holding s key to shutdown the pi (in seconds)
HOLD_DURATION_TO_STOP=5
start_of_stop_hold=0

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

pi = pigpio.pi() # Connect to local Pi.

def init_pin_mapping(pin):
  pi.set_pull_up_down(pin, pigpio.PUD_UP)   
  pi.set_mode(pin, pigpio.INPUT) 
  pi.set_glitch_filter(pin, GLITCH_FILTER)
  callbacks.append(pi.callback(pin, pigpio.EITHER_EDGE, emitKey))

def init_hold_stop():
  callbacks.append(pi.callback(STOP, pigpio.EITHER_EDGE, holdStop))


def emitKey(gpio, level, tick):
  if level == 1: 
    #print("Rising edge detected, ", mappings[gpio], " released")
    device.emit(mappings[gpio],1)
    device.emit(mappings[gpio],0)
  else: 
    #print("Falling edge detected, ", mappings[gpio], " pressed")
    device.emit(mappings[gpio],0)
  
def holdStop(gpio, level, tick):
  global start_of_stop_hold
  if level == 1: 
    finish_of_stop_hold=time.time()
    duration = finish_of_stop_hold - start_of_stop_hold
    if(duration>=HOLD_DURATION_TO_STOP):
      shutdown()
  else:
    start_of_stop_hold=time.time()


def disconnectGPIO():
  print("Cancel calbacks")
  for cb in callbacks:
    cb.cancel()
  print("Disconnect from local pi")
  pi.stop() 

def shudtown():
  disconnectGPIO()
  command = "/usr/bin/sudo /sbin/shutdown -r now"
  import subprocess
  process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
  output = process.communicate()[0]
  print output

try:  
  print("Init GPIO mappings callbacks")
  for pin in mappings.keys():
    print("map ",pin," to ",mappings[pin])
    init_pin_mapping(pin)
  print("Init stop hold callback")
  init_hold_stop()
  
  print("Running main loop...")
  while True:
    time.sleep(1)

except KeyboardInterrupt:
  disconnectGPIO()



