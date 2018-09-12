LOAD DATA INFILE 'real_names/yob2018.txt' 
	IGNORE INTO TABLE names 
	FIELDS TERMINATED BY ','
	ENCLOSED BY ''
	LINES TERMINATED BY '\n'
    (name, sex, @dummy)
    SET year = 2018;