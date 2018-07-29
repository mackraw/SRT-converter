# SRT Time Code Converter

This little app is automating substitution of time codes in SRT files.

## Background

In research on closed captioning, one of the ways to measure quality is by calculating latency, i.e. what is the delay between the time the words are spoken and their appearance on screen as closed captions. 

Two pieces of information are needed to measure latency: (a) when the caption appears on the screen (in-time), and (b) when the words were actually spoken.

Captions need to be provided in the SRT format, which is a text file of the following structure:

`5`  
`00:00:04,971 --> 00:00:08,241`  
`AFTER HIS RELEASE SPENT LAST`  
` `  
`6`  
`00:00:08,241 --> 00:00:13,980`  
`YEAR AS THE BACKUP TO ALEX SMITH`

The app uses a tab-separated CSV file with the actual times when the words were spoken. For example:

`AFTER	after	0.13	0.45`  
`HIS	his	0.45	0.61`  
`RELEASE	release	0.61	1.01`  
`SPENT	spent	1.02	1.33`  
`LAST	last	1.33	1.67`  
`YEAR	year	1.67	1.98`  
`AS	as	2.39	2.65`  
`THE	the	2.66	2.92`  
`BACKUP	backup	2.96	3.45`  
`TO	to	3.45	3.58`  
`ALEX	alex	3.58	4`  
`SMITH	smith	4.01	4.29`  

## What the app does

The app compares the two files, and, if the first word of the caption in the SRT file matches a word in the CSV file, it substitutes the original in-time for the actual in-time.

**For example:** Caption `5` starts at `00:00:04,971`. However, the word `after` is actually spoken at `0.13`. The app will substitute and format the actual in-time so that the returned SRT file looks like this:

`5`  
`00:00:00,130 --> 00:00:08,241`  
`AFTER HIS RELEASE SPENT LAST`  
` `  
`6`  
`00:00:01,670 --> 00:00:13,980`  
`YEAR AS THE BACKUP TO ALEX SMITH`

This allows for easy comparison of two SRT files to calculate latency. Since out-times are unimportant to these calculations they remain unchanged.

This app accounts for:
* repetitions (if more then one caption starts with the same word)
* word position (only work with words in the first position of the caption)
* caption formatting (`>>` used to denote speaker change)
* multiple line captions (only work on the first line)
