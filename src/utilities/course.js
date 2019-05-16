const create = (title, description, url, thumbnailUrl) => {
    const now = new Date();
    return {
        title,
        description,
        url,
        thumbnailUrl,
        successVote: [true],
        created_at: now,
        updated_at: now
    }
}

module.exports = {
    create
}