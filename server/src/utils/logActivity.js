import ActivityLog from "../models/activitylogModel.js";

// activity logger

const logActivity = async ({
    actor, actorRole, action, entityType, entityId = null, metadata = {}, ipAddress = null
}) => {
    try{
        await ActivityLog.create({
             actor, actorRole, action, entityType, entityId, metadata, ipAddress
        });

    } catch (error) {
        console.error("Activity log failed:", error.message);
        
    }
};

export default logActivity;