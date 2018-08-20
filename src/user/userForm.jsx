/*
UserForm
Created by Luiz Felipe Mota
 */

import React,{Component} from 'react'
import {Button, Input, Label, Collapse, Navbar, NavbarToggler} from 'reactstrap'
import {AvForm, AvField} from 'availity-reactstrap-validation'
import axios from 'axios'

import UserField from './userField'

//JSON Server local adress
const _URL = 'http://localhost:3001/users';

class UserForm extends Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            user: {company: '', user: '', note: ''},
            list: [],
            filter: [],
            collapsed: true
        }
    }

    componentWillMount(){
        this.getUsers()
    }

    //Get all data from JSON Server and update the states 'list' and 'filter', so UserForm just handle these states
    // without access the server again.
    getUsers(){
        axios.get(_URL).then(resp => this.setState({list: resp.data, filter: resp.data}));
    }

    //Creates a state copy and adds a new user if it's necessary.
    getUpdatedList(user, add = true){
        const list = this.state.list.filter(u => u.id !== user.id);
        if(add) list.unshift(user);

        this.setState({list, filter: list});
    }

    //Filter function.
    handleSearch(e){
        if(e.target.value !== '')
        {
            const _regex = new RegExp(`^${e.target.value}`,'g');
            const filter = this.state.list.filter(user => user.user.match(_regex) || user.company.match(_regex));
            this.setState({filter});
        }
        else{
            this.setState({filter: this.state.list});
        }

    }

    //Updates the state when a input happens.
    handleChange(e){
        const user = {...this.state.user};
        user[e.target.name] = e.target.value;
        this.setState({user});
    }

    //Submit data to JSON Server.
    handleSubmit(e){

        axios.post(_URL,this.state.user).then(resp => {
            this.getUpdatedList(resp.data);
        })

        //Reset the form
        this.form && this.form.reset();

        this.handleToggle();
    }

    //Delete function.
    handleDelete(user,e){
        e.preventDefault();

        axios.delete(`${_URL}/${user.id}`).then(resp => {
            this.getUpdatedList(user,false);
        })
    }

    //Bootstrap toogle function.
    handleToggle(){
        this.setState({collapsed: !this.state.collapsed});
    }

    render(){
        return(
            <div className='user-screen'>
                <Navbar sticky={'top'} color='light' light>
                <NavbarToggler onClick={() => this.handleToggle()} className="mr-2" />
                <Collapse isOpen={!this.state.collapsed} navbar>
                <div className='border-form'>
                    <div className='form-data'>
                        <AvForm onValidSubmit={this.handleSubmit} ref={c => (this.form = c)}>
                            <AvField name='company' label='Company:' type='text' id='company' placeholder='Company name' bsSize='sm'
                                maxLength="20" onChange={e => this.handleChange(e)}/>
                            <AvField type='text' name='user' label='Name:' id='userName' placeholder='Name:' bsSize='sm'
                                maxLength="30" onChange={e => this.handleChange(e)}/>
                            <AvField type='textarea' name='note' label='Notes:' id='note' placeholder='Note:' bsSize='sm'
                                maxLength="35" onChange={e => this.handleChange(e)}/>
                            <Button color='info'>Add Contact</Button>
                        </AvForm>
                    </div>
                </div>
                </Collapse>
                </Navbar>
                <Navbar sticky={'top'} color='light' light>
                    <Input type='text' name='company' id='company' placeholder='Search' bsSize='sm' 
                                    onChange={e => this.handleSearch(e)}/>
                </Navbar>
                <UserField list={this.state.filter} handleDelete={this.handleDelete}/>
            </div>
        )
    }
}

export default UserForm