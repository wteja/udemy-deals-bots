const repository = db => {
    const courses = db.collection('courses')

    const add = course => {
        return new Promise((resolve, reject) => {
            courses.insertOne(course, (err, res) => {
                if (err)
                    return reject(err)

                resolve(res.ops[0])
            })
        })
    }

    const isUrlExists = url => {
        return new Promise((resolve, reject) => {
            try {
                courses.countDocuments({ url }, (err, total) => {
                    if(err)
                        return reject(err);
                        
                    resolve(total > 0);
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    return {
        add,
        isUrlExists
    }
};

module.exports = {
    connect(db) {
        return new Promise((resolve, reject) => {
            if(!db)
                return reject(new Error("Please provide database connection."))

            resolve(repository(db))
        })
    }
};