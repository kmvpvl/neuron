import React from "react";
import "./user.css"
export interface IUserProps {

}

export interface IUserState {

}

export default class User extends React.Component<IUserProps, IUserState> {
    render(): React.ReactNode {
        return <span>🕵️</span>
    }
}