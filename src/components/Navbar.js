const Navbar = () => {
    return (
        <nav className="navbar">
            <h2 onClick={() => window.location.reload()} className="text_logo">
                Le<span>Stat</span>
                <span>
                    <img
                        onClick={() => window.location.reload()}
                        className="logo_icon"
                        src={`${process.env.PUBLIC_URL}/images/logo_icon(2).svg`}
                        alt="icon"
                    />
                </span>
            </h2>

            <ul class="nav-links">
                <li><a href="#projects">Projects</a></li>
                <li><a href="mailto:rnguyen2102@gmail.com">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
