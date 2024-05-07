import React from "react";
import "./user.css"
import { serverCommand } from "../../common/fetches";
export interface IUserProps {
    onCreateUser: (username: string)=> void;
    username?: string;
}

type UserMode = "start" | "register" | "signin" | "logged";

export interface IUserState {
    mode: UserMode;
}

export default class User extends React.Component<IUserProps, IUserState> {
    state: IUserState = {
        mode: this.props.username === undefined?"start":"logged"
    };
    _usernameRef: React.RefObject<HTMLInputElement> = React.createRef();
    _checkusernamestatusRef: React.RefObject<HTMLSpanElement> = React.createRef();
    _createuserbuttonRef: React.RefObject<HTMLButtonElement> = React.createRef();
    toSignInMode(){
        this.setState({mode: "signin"});
    }
    toRegisterMode(){
        this.setState({mode: "register"});
    }
    _checkName() {
        if (this._createuserbuttonRef.current) this._createuserbuttonRef.current.disabled = true;
        serverCommand("isusernamefree", undefined, {
            "username": this._usernameRef.current?.value
        }, (res)=> {
            if (this._createuserbuttonRef.current) this._createuserbuttonRef.current.disabled = !res
        }, (err)=>{
            if (this._createuserbuttonRef.current) this._createuserbuttonRef.current.disabled = true;
        })
    }
    _newUser() {
        this.props.onCreateUser(this._usernameRef.current?.value as string);
        this.setState({mode: "logged"})
    }
    render(): React.ReactNode {
            switch(this.state.mode) {
                case "start":             
                    return <span className="user-container"><button onClick={this.toSignInMode.bind(this)}>Sign in</button> or <button onClick={this.toRegisterMode.bind(this)}>Register</button></span>
                case "signin":             
                    return <span className="user-container"><input placeholder="User name"></input><input placeholder="Authorization token"></input> <button>Login</button></span>
                case "register":             
                    return <span className="user-container"><input placeholder="Choose user name" autoFocus={true} ref={this._usernameRef} onChange={this._checkName.bind(this)}></input><span ref={this._checkusernamestatusRef}></span><button ref={this._createuserbuttonRef} onClick={this._newUser.bind(this)}>Create user</button></span>
                default:
                    return <span className="user-container">🕵️{this.props.username}</span>
                }
    }
}