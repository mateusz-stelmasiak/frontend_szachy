import React, {Component} from 'react';
import "./NavBar.css";
import ProfileWidget from "./Components/ProfileWidget"
import LogoWidget from "./Components/LogoWidget"
import {logout} from "../../serverLogic/LogRegService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";

//buttons on different subpages
let landingPageItems = ["PLAY", "LOGIN", "REGISTER"];
let mainPageItems = ["STATS", "PLAY"];

class NavBar extends Component {



    constructor(props) {
        super(props);
        this.title = props.title;
        this.currentItems = landingPageItems;
        this.logoVisible=true;
        this.playerWidgetVisible=false;
        this.playerUsername="User_NotFound";
        this.logoutIcon=<FontAwesomeIcon
            className="NavBar-signout"
            icon={faSignOutAlt}
            onClick={logout}
        />;
    }



    scrollToSection(sectionID) {
        this.closeNav();
        let section = document.getElementById(sectionID);
        if (typeof section !== 'undefined' && section !== null) {
            section.scrollIntoView({behavior: 'smooth'});
        }
    }

    /* Open the sidenav */
    openNav() {
        let navMenuDOM = document.getElementById("mobile_Nav");
        if (typeof navMenuDOM !== 'undefined' && navMenuDOM !== null) {
            navMenuDOM.style.width = "100%";
        }
    }

    /* Close/hide the sidenav */
    closeNav() {
        let navMenuDOM = document.getElementById("mobile_Nav");
        if (typeof navMenuDOM !== 'undefined' && navMenuDOM !== null) {
            navMenuDOM.style.width = "0";
        }
    }

    getAppropriateItems(){
        let path= this.props.location.pathname;

        if (typeof path !== 'undefined' && path !== null) {
            if(path==="/login"){
                this.currentItems = landingPageItems;
                this.playerWidgetVisible=false;
                this.logoVisible=true;
            }
            else {
                if(path==="/") this.currentItems = mainPageItems;
                if(path==="/play") this.currentItems=[];

                this.logoVisible=false;
                this.playerWidgetVisible=true;
                let userData= localStorage.getItem('username');
                if (userData!==null) this.playerUsername=userData;
            }
        }

        //update menu buttons
        this.menuItemsList = this.currentItems.map(item =>
            <button onClick={() => this.scrollToSection(item)}>
                {item}
            </button>);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            this.getAppropriateItems();
        }
    }

    render() {
        this.getAppropriateItems();

        return (
            <header className="NavBar">
                {this.logoVisible && <LogoWidget/>}
                {this.playerWidgetVisible && <ProfileWidget username={this.playerUsername}/>}

                <div className="NavBar-navMenu NavMenu" onClick={this.openNav}>
                    <div className="NavBar-navMenu-icon-part"/>
                    <div className="NavBar-navMenu-icon-part"/>
                    <div className="NavBar-navMenu-icon-part"/>
                </div>

                {this.playerWidgetVisible &&this.logoutIcon}


                <div id="mobile_Nav" className="sidenav">
                    <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
                    {this.menuItemsList}
                </div>

                <div className="NavBar-buttons NavButtons" id="navButtons">
                    {this.menuItemsList}
                </div>
            </header>
        );

    }

}

export default NavBar;