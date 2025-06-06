async function fetchActivity(req, res) {
    const Id = req.params.Id;
    const userId = req.params.userId;

    try {
        const [
            moodsResponse,
            selfCareCount,
            testVisitCount,
            conversationsResponse,
        ] = await Promise.all([
            moodTrackerActivityGet(Id),
            getSelfCareActivityCount(Id),
            getTestVisitCount(Id),
            getConversationSessions(userId),
        ]);

        const totalMoodsCount = moodsResponse.totalMoodsCount;
        const totalSelfCareCount = selfCareCount;
        const totalTestVisitCount = testVisitCount;
        const conversationsLength = conversationsResponse.length;

        const responseData = {
            totalMoodsCount,
            totalSelfCareCount,
            totalTestVisitCount,
            conversationsLength,
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching activity:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}