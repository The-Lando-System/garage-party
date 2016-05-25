import serial
import time
import json
import requests
import argparse
import sys
import datetime
import random

collectFreq = 0.001 # in seconds
postFreq = 0.01   # in seconds, cannot be greater than collect
postFreq = postFreq / collectFreq

parser = argparse.ArgumentParser(description='Collect and send garage door status to a server')
parser.add_argument('--url', dest='url', required=True)
parser.add_argument('--f-collect', dest='collectFreq', type=float, required=True)
parser.add_argument('--f-send', dest='postFreq', type=float, required=True)
args = parser.parse_args()

# Utility function to return the current time formatted as a string
def currentTime():
  return datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")

# Given a single value of sound data, post it to the website
def postToWebsite( data ):
  state = "Open";
  if (data > 0):
    state = "Closed"
  postData = {
    "actualState": state,
    "actualStateChangeTime": currentTime()
  }
  postData = json.dumps(postData)
  headers = {'Content-type': 'application/json'}

  try:
    # r = requests.post(args.url,data=postData,headers=headers)
    print postData
  except requests.exceptions.RequestException as e:
    print e
    sys.exit(1)
  return

# Given an array of sound data calculate the average and call the post method with it
def postProcess( dataArray ):
  total = 0
  for value in dataArray:
    total += value
  #print total
  #print len(dataArray)
  avg = total / float(len(dataArray))

  roundedAvg = int(round(avg))
  postToWebsite(roundedAvg)
  return

def collectData(conn):

  data = conn.readline().rstrip().decode("utf-8")
  #data = conn.readline()
  # For test
  #data = int(round(random.random()))
  #print data

  return data


def processRawData(data):
  #if ((data.isnumeric()) and (data != '-1')):
  if ((data.isdigit()) and (data != '1')):
    return data
  else:
    return 'N'  


def testEndpoint():
  # Validate the given URL by sending a test POST
  postData = {
    "actualState": "Closed",
    "actualStateChangeTime": currentTime()
  }
  postData = json.dumps(postData)
  headers = {'Content-type': 'application/json'}
  testUrl = args.url + "TESTING"
  try:
    r = requests.post(testUrl,data=postData,headers=headers)
  except requests.exceptions.RequestException as e:
    print e
    sys.exit(1)

#################### MAIN ##########################

# Set the collection and post rates
if (args.postFreq < args.collectFreq):
    args.postFreq = args.collectFreq
postFreq = args.postFreq / args.collectFreq

# testEndpoint()

# Listen for data on the serial port, process data at the given frequency
ser = 0
try:
  ser = 0
  #ser = serial.Serial('COM3',9600,timeout=0)
  ser = serial.Serial('/dev/ttyACM0',9600,timeout=0)
  #ser.open()
except Exception, e:
  print "Error opening the serial port: " + str(e)
  exit()

dataArray = []
count = 0
while True:
  data = processRawData(collectData(ser))
  if data != 'N':
    dataArray.append(int(data))
  else:
    dataArray.append(0)
  time.sleep(args.collectFreq)
  count+=1
  if count > postFreq:
    postProcess(dataArray)
    count = 0
    dataArray = []
