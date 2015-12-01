DROP TABLE IF EXISTS posts;
CREATE TABLE posts(
post_id INTEGER,
post_title TEXT,
post_text TEXT,
PRIMARY KEY(post_id)
);


DROP TABLE IF EXISTS tags;
CREATE TABLE tags(
tag_id INTEGER,
tag_name TEXT UNIQUE,
PRIMARY KEY(tag_id)
);

DROP TABLE IF EXISTS mapping;
CREATE TABLE mapping(
post_id INTEGER, 
tag_id INTEGER,
PRIMARY KEY(post_id, tag_id)
FOREIGN KEY (post_id) REFERENCES posts(post_id),
FOREIGN KEY (tag_id)  REFERENCES tags(tag_id)
);