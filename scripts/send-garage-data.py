#!/usr/bin/python

import serial
import time
import json
import requests
import argparse
import sys
import datetime
import random

parser = argparse.ArgumentParser(description='Collect and send garage door status to a server')
parser.add_argument('--url', dest='url', required=True)
parser.add_argument('--freq', dest='freq', type=float, required=True)
args = parser.parse_args()

# Utility function to return the current time formatted as a string
def currentTime():
  return datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")

# Given a single value of sound data, post it to the website
def postToWebsite(state):
  postData = {
    "actualState": state,
    "actualStateChangeTime": currentTime()
  }
  postData = json.dumps(postData)
  headers = {'Content-type': 'application/json'}

  try:
    r = requests.post(args.url,data=postData,headers=headers)
    print postData
  except requests.exceptions.RequestException as e:
    print 'Post Error!'
    print e
    sys.exit(1)
  return


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
    print 'POST error!'
    print e
    sys.exit(1)

#################### MAIN ##########################

# Set the collection and post rates

testEndpoint()

while True:
  try:
    f = open('garage-data.txt','r')
    data = f.readline().rstrip().decode("utf-8")
    print data
    f.close()
    if ((data != '') and (data != '0')):
      postToWebsite('Open')
    else:
      postToWebsite('Closed')
    time.sleep(args.freq)
  except: 
    print 'Error: ', sys.exc_info()[0]
    time.sleep(args.freq)
