import mongoose,{Schema,Document} from 'mongoose';

export interface IMessage extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessages: boolean;
    messages: IMessage[];
}

const UserSchema: Schema<IUser> = new Schema({
    username:{
        type: String,
        required: [true,"username is required"],
        unique: [true,"username already exists"],
        minlength: [3,"username must be at least 3 characters long"],
        maxlength: [20,"username must be at most 20 characters long"]
    },
    email:{
        type: String,
        required: [true,"email is required"],
        unique: [true,"email already exists"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    password:{
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verifyCode:{
        type: String,
        default: null
    },
    verifyCodeExpiry:{
        type: Date,
        default: null
    },
    isAcceptingMessages:{
        type: Boolean,
        default: true
    },
    messages:{
        type: [MessageSchema]
    }
})

const UserModel = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", UserSchema);

export default UserModel;