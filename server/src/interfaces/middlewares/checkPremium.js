
const { GetUser } = require("../../application/use-cases/user-use-cases");
const userRepository = require("../../infrastructure/database/repositories/userRepositoryImpl");

const getUserUseCase = new GetUser(userRepository);

const checkPremium = async (req, res, next) => {
    const userId = req.userId;
    const user = await getUserUseCase.execute({ _id: userId })
    if (user?.plan === "free") {
        return res.status(402).json({ message: "premium membership is required." })
    } else {
        return next()
    }
}

module.exports = checkPremium