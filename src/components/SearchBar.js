const SearchBar = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="search-bar">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="enter player name..."
    />
    <button>
      <img
        src={`${process.env.PUBLIC_URL}/icons/search.svg`}
        alt="Search"
      />
    </button>

  </form>
);
export default SearchBar;
