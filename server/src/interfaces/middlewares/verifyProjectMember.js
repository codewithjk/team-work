const { ListAllMembers } = require("../../application/use-cases/project-use-cases");
const ProjectRepositoryImpl = require("../../infrastructure/database/repositories/projectRepositoryImpl");

const projectRepository = new ProjectRepositoryImpl()
const listAllMembersUseCase = new ListAllMembers(projectRepository)
const verifyProjectMember = async(req,res,next)=>{
   try {
     const userId  =req.userId;
     const projectId = req.params.projectId;
     const members = await listAllMembersUseCase.execute(projectId)
     const member = members.find((member)=>member.user._id == userId)
     console.log(member)
    if(member){
        next();
    }else{
        return res.status(403).json({ message: "Access denied. You are not a member of this project." });
    }
   } catch (error) {
    console.error("Error verifying project member:", error);
    return res.status(500).json({ message: "Internal server error." });

   }
}


module.exports = verifyProjectMember