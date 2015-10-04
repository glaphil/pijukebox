from time import sleep             # lets us have a delay  
  
try:  
	while True:  
		print("test")  
		sleep(0.5)                 # wait half a second  
except KeyboardInterrupt:          # trap a CTRL+C keyboard interrupt  
	print("end")

