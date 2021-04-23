const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Books');
    db.run('DROP TABLE IF EXISTS Categories');
    db.run('DROP TABLE IF EXISTS Artists');
    db.run('DROP TABLE IF EXISTS Publishers');
    db.run('DROP TABLE IF EXISTS Accounts');
    db.run('DROP TABLE IF EXISTS Comments');
    db.run('DROP TABLE IF EXISTS BookImages');
    db.run('DROP TABLE IF EXISTS AccountImages');
    db.run('DROP TABLE IF EXISTS Adverts');
    db.run('DROP TABLE IF EXISTS AdvertImages');
    db.run('DROP TABLE IF EXISTS Languages');
    // bảng quan hệ n-n 
    db.run('DROP TABLE IF EXISTS Compose');// artist - Books
    db.run('DROP TABLE IF EXISTS ConnectLang');// language - Books
    db.run('DROP TABLE IF EXISTS CatRela');// books - categories
    db.run('DROP TABLE IF EXISTS Bought'); // account - books đã mua
    db.run('DROP TABLE IF EXISTS Watched'); // account - books đã xem
    db.run('DROP TABLE IF EXISTS BooksAdvert');// book- advert
    db.run('DROP TABLE IF EXISTS BookInShop');// book- shop

    //other table
    db.run('DROP TABLE IF EXISTS Contact');
    db.run(`DROP TABLE IF EXISTS ProblemContact`);
    db.run(`DROP TABLE IF EXISTS AboutUs`);
    db.run(`DROP TABLE IF EXISTS Shops`);
    db.run('DROP TABLE IF EXISTS ShopImages');
    db.run('DROP TABLE IF EXISTS Blogs');
    db.run('DROP TABLE IF EXISTS BlogImages');
    db.run('DROP TABLE IF EXISTS CommentBlogs');
    db.run('DROP TABLE IF EXISTS Carts');
    db.run('DROP TABLE IF EXISTS Bills');
    db.run('DROP TABLE IF EXISTS Status');

    db.run(`CREATE TABLE Accounts (
        id integer primary key,
        name text not null,
        username text not null,
        password text not null,
        type integer default 0,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text
    )`);
    db.run(`CREATE TABLE Publishers (
        id integer primary key,
        name text not null,
        routine text not null,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE Books (
        id integer primary key,
        name text not null,
        routine text not null,
        description text not null, 
        publisher_id integer not null,
        price integer not null,
        sale integer,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(publisher_id) REFERENCES Publishers(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE Categories (
        id integer primary key,
        name text not null,
        routine text not null,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE Languages (
        id integer primary key,
        name text not null,
        routine text not null,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE Artists (
        id integer primary key,
        name text not null,
        routine text not null,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE Comments (
        id integer primary key,
        content text not null,
        book_id integer not null,
        re_comment integer not null default 0,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(book_id) REFERENCES Books(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE BookImages (
        id integer primary key,
        name text not null,
        path text not null,
        book_id integer not null,
        main int not null default 0,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(book_id) REFERENCES Books(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE AccountImages (
        id integer primary key,
        name text not null,
        path text not null,
        account_id integer not null,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(account_id) REFERENCES Accounts(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE Adverts (
        id integer primary key,
        name text not null,
        description text not null,
        short_description text not null,
        begin text not null,
        finish text not null,
        path text not null,
        create_by integer not null, 
        create_at text not null,
        update_by integer,
        update_at text,
        deleted integer not null default 0,
        deleted_by integer, 
        deleted_at text,
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id)
    )`);
    db.run(`CREATE TABLE AdvertImages (
        id	INTEGER,
        name	TEXT NOT NULL PRIMARY KEY,
        path	TEXT NOT NULL,
        advert_id	INTEGER NOT NULL,
        main	INTEGER NOT NULL DEFAULT 0,
        create_by	INTEGER NOT NULL,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	TEXT,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_at	TEXT,
        deleted_by	INTEGER,
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        FOREIGN KEY(advert_id) REFERENCES Adverts(id)
    );`)
    db.run(`CREATE TABLE Status (
        id	INTEGER,
        name	TEXT NOT NULL,
        key	INTEGER NOT NULL,
        PRIMARY KEY(id)
    )`)
    db.run(`CREATE TABLE BooksAdvert(
        id integer primary key,
        advert_id integer not null,
        book_id integer not null,
        FOREIGN KEY(advert_id) REFERENCES Adverts(id),
        FOREIGN KEY(book_id) REFERENCES Books(id)
    )`);
    db.run(`CREATE TABLE ConnectLang(
        id integer primary key,
        language_id integer not null,
        book_id integer not null,
        FOREIGN KEY(language_id) REFERENCES ConnectLang(id),
        FOREIGN KEY(book_id) REFERENCES Books(id)
    )`);

    db.run(`CREATE TABLE Compose (
        id integer primary key,
        artist_id integer not null,
        book_id integer not null,
        FOREIGN KEY(artist_id) REFERENCES Artists(id),
        FOREIGN KEY(book_id) REFERENCES Books(id)
    )`);
    db.run(`CREATE TABLE CateRela (
        id integer primary key,
        cate_id integer not null,
        book_id integer not null,
        FOREIGN KEY(cate_id) REFERENCES Categories(id),
        FOREIGN KEY(book_id) REFERENCES Books(id)
    )`);
    db.run(`CREATE TABLE Bought (
        id integer primary key,
        account_id integer not null,
        book_id integer not null,
        rate integer,
        review text,
        FOREIGN KEY(account_id) REFERENCES Accounts(id),
        FOREIGN KEY(book_id) REFERENCES Books(id)
    )`);
    db.run(`CREATE TABLE Watched (
        id integer primary key,
        account_id integer not null,
        book_id integer not null,
        FOREIGN KEY(account_id) REFERENCES Accounts(id),
        FOREIGN KEY(book_id) REFERENCES Books(id)
    )`);
    db.run(`CREATE TABLE AdvertImages (
        id	INTEGER primary key,
        name	TEXT NOT NULL,
        advert_id	INTEGER NOT NULL,
        create_by	INTEGER NOT NULL,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	TEXT,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_at	TEXT,
        deleted_by	INTEGER,
        FOREIGN KEY(advert_id) REFERENCES Adverts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id)
    );`);
    db.run(`CREATE TABLE Contact (
        id	INTEGER,
        name	TEXT NOT NULL,
        website	TEXT,
        address	TEXT NOT NULL,
        street	TEXT NOT NULL,
        ward	TEXT NOT NULL,
        district	TEXT NOT NULL,
        province	TEXT NOT NULL,
        country	TEXT NOT NULL,
        phonenumber	TEXT NOT NULL,
        email	TEXT NOT NULL,
        facebook	TEXT,
        instagram	TEXT,
        twitter	TEXT,
        zalo	TEXT,
        youtube	TEXT,
        google	TEXT,
        create_by	INTEGER NOT NULL,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	TEXT,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_at	TEXT,
        deleted_by	INTEGER,
        PRIMARY KEY('id'),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id)
    );`);
    db.run(`CREATE TABLE 'ProblemContact' (
        'id'	INTEGER,
        'name'	TEXT NOT NULL,
        'email'	TEXT NOT NULL,
        'subject'	TEXT NOT NULL,
        'message'	TEXT NOT NULL,
        'receive_at'	TEXT NOT NULL,
        'reply'	INTEGER NOT NULL DEFAULT 0,
        'reply_by'	INTEGER,
        'reply_at'	TEXT,
        're_content'	TEXT,
        'deleted'	INTEGER NOT NULL DEFAULT 0,
        'deleted_by'	INTEGER,
        'deleted_at'	TEXT,
        'read'	INTEGER NOT NULL DEFAULT 0,
        'read_by'	INTEGER,
        'read_at'	TEXT,
        FOREIGN KEY('read_by') REFERENCES 'Accounts'('id'),
        FOREIGN KEY('reply_by') REFERENCES 'Accounts'('id'),
        FOREIGN KEY('deleted_by') REFERENCES 'Accounts'('id'),
        PRIMARY KEY('id')
    );`);
    db.run(`CREATE TABLE AboutUs (
        id	INTEGER,
        name	TEXT NOT NULL,
        content	TEXT NOT NULL,
        image_name	TEXT,
        routine TEXT,
        note_image	TEXT,
        position	INTEGER NOT NULL,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_by	INTEGER,
        deleted_at	TEXT,
        create_by	INTEGER NOT NULL,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	TEXT,
        PRIMARY KEY(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id)
    );`);
    db.run(`CREATE TABLE Shops (
        id	INTEGER,
        code	INTEGER NOT NULL,
        name	TEXT NOT NULL,
        routine	TEXT NOT NULL,
        address	INTEGER NOT NULL,
        street	TEXT NOT NULL,
        ward	TEXT NOT NULL,
        district	TEXT NOT NULL,
        city	TEXT NOT NULL,
        routine_city	TEXT NOT NULL,
        country	TEXT NOT NULL,
        opening_date	TEXT NOT NULL,
        manager	INTEGER NOT NULL,
        active	INTEGER NOT NULL DEFAULT 0,
        create_by	INTEGER NOT NULL DEFAULT 1,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	TEXT,
        close_by	INTEGER,
        close_at	TEXT,
        FOREIGN KEY(close_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(manager) REFERENCES Accounts(id),
        PRIMARY KEY(id)
    );`);
    db.run(`CREATE TABLE BookInShop (
        id	INTEGER,
        shop_id	INTEGER NOT NULL,
        book_id	INTEGER NOT NULL,
        number	INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(book_id) REFERENCES Books(id),
        PRIMARY KEY(id),
        FOREIGN KEY(shop_id) REFERENCES Shops(id)
    );`);
    db.run(`CREATE TABLE ShopImages (
        id	INTEGER,
        name	TEXT NOT NULL,
        path	TEXT NOT NULL,
        shop_id	INTEGER NOT NULL,
        main	INTEGER NOT NULL DEFAULT 0,
        create_by	INTEGER NOT NULL,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	TEXT,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_by	INTEGER,
        deleted_at	TEXT,
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        FOREIGN KEY(shop_id) REFERENCES Shops(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        PRIMARY KEY(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id)
    );`);
    db.run(`CREATE TABLE Blogs (
        id	INTEGER,
        name	TEXT NOT NULL,
        routine	TEXT NOT NULL,
        short_blog	TEXT NOT NULL,
        full_blog	TEXT NOT NULL,
        create_time	TEXT NOT NULL,
        create_date	TEXT NOT NULL,
        create_by	INTEGER NOT NULL,
        update_by	INTEGER NOT NULL,
        update_time	TEXT,
        update_date	TEXT,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_by	INTEGER,
        deleted_time	TEXT,
        deleted_date	TEXT,
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        PRIMARY KEY(id)
    );`);
    db.run(`CREATE TABLE BlogImages (
        id	INTEGER,
        name	TEXT NOT NULL,
        path	TEXT NOT NULL,
        blog_id	INTEGER NOT NULL,
        main	INTEGER NOT NULL DEFAULT 0,
        create_by	INTEGER NOT NULL,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	INTEGER,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_by	INTEGER,
        deleted_at	INTEGER,
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(blog_id) REFERENCES Blogs(id),
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        PRIMARY KEY(id)
    );`);
    db.run(`CREATE TABLE CommentBlog (
        id	INTEGER,
        content	TEXT NOT NULL,
        blog_id	INTEGER NOT NULL,
        re_comment	INTEGER NOT NULL DEFAULT 0,
        create_by	INTEGER NOT NULL,
        create_at	TEXT NOT NULL,
        update_by	INTEGER,
        update_at	TEXT,
        deleted	INTEGER NOT NULL DEFAULT 0,
        deleted_by	INTEGER,
        deleted_at	TEXT,
        FOREIGN KEY(deleted_by) REFERENCES Accounts(id),
        FOREIGN KEY(update_by) REFERENCES Accounts(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        FOREIGN KEY(blog_id) REFERENCES Blogs(id),
        PRIMARY KEY(id)
    );`);
    db.run(`CREATE TABLE Carts (
        id	INTEGER,
        book_id	INTEGER NOT NULL,
        amount	INTEGER NOT NULL DEFAULT 1,
        create_by	INTEGER NOT NULL,
        FOREIGN KEY(book_id) REFERENCES Books(id),
        FOREIGN KEY(create_by) REFERENCES Accounts(id),
        PRIMARY KEY(id)
    );`);
    db.run(`CREATE TABLE Bills (
        id	INTEGER,
        board_code	TEXT NOT NULL,
        book_id	INTEGER NOT NULL,
        amount	INTEGER NOT NULL,
        create_by	TEXT NOT NULL,
        phone	TEXT NOT NULL,
        address	INTEGER NOT NULL,
        street	TEXT NOT NULL,
        ward	TEXT NOT NULL,
        district	TEXT NOT NULL,
        city	TEXT NOT NULL,
        status	INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY(id),
        FOREIGN KEY(book_id) REFERENCES Books(id),
        FOREIGN KEY(status) REFERENCES Status(id)
    );`);

});
