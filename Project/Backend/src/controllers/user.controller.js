import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation-not empty
    //check if user exists:email
    //create user object-create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const { username, email, fullname, password } = req.body;
    //   console.log("email",email);
    //   console.log("password",password);
    if (fullname === "" || username === "" || email === "" || password === "") {
        throw new ApiError(400, "All fileds are required!");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const user=await User.create({
        fullname,
        username:username.toLowerCase(),
        email,
        password,
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Intenal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully...")
    )
});

export { registerUser };
