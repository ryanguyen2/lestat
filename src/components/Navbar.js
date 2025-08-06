// components/Navbar.js
const Navbar = () => {
    return (
        <nav className="navbar">
            <h2 class="text_logo">Le<span>Stat</span><span><img class="logo_icon"src="./images/logo_icon(2).svg" alt="icon"/></span></h2>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="mailto:rnguyen2102@gmail.com">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
