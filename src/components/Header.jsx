import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">Naver</div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <nav className="nav-menu">
                <ul>
                    <li>Home</li>
                    <li>News</li>
                    <li>Sports</li>
                    <li>Entertainment</li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
