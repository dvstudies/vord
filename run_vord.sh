#!/bin/bash
cd server
npm run open_start
npm run dev &
cd ../client
npm run dev &
wait
