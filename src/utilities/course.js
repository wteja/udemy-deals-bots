const create = (title, description, url) => {
    const now = new Date();
    return {
        title,
        description,
        url,
        successCount: 1,
        created_at: now,
        updated_at: now
    }
}

module.exports = {
    create
}