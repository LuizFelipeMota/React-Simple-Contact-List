/*
Component UserField
Created by Luiz Felipe Mota
*/

import React, {Component} from 'react'

class UserField extends Component{
    constructor(props){
        super(props)
        this.state = {
            listUsers:[],
            list: this.props.list || []
        }
    }

    //Check if the list was updated
    static getDerivedStateFromProps(nextProps,prevState){
        if(nextProps.list !== prevState.list){
            return {list: nextProps.list};
        }
        else{
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.list !== this.state.list){
            this.getUsers();
        }
    }

    //Creates the contacts based on return from the server.
    async getUsers(){
        const list = this.state.list
        const users = list.map((u) => (
                <div key={u.id} className='user-border'>
                    <div key={u.id} className='user-data'>
                            <p><strong>Company: </strong>{u.company}</p>
                            <p><strong>Name: </strong>{u.user}</p>
                            <p><strong>Notes: </strong>{u.note}</p>
                            <a href="" onClick={e => {this.props.handleDelete(u,e)}}>Delete</a> 
                    </div>
                </div>
        ))
        this.setState({listUsers: users})
    }

    render(){
        return(
            <div className='user-field'>
            {this.state.listUsers}
            </div>
        )
    }
}

export default UserField