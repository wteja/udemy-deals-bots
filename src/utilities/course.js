const create = (title, description, url, thumbnailUrl) => {
    const now = new Date();
    return {
        title,
        description,
        url,
        thumbnailUrl,
        successCount: 1,
        created_at: now,
        updated_at: now
    }
}

module.exports = {
    create
}