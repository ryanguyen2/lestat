// components/SearchBar.js
const SearchBar = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="search-bar">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Enter player name"
    />
    <button><img src="/icons/search.svg" Alt="Search"/></button>
  </form>
);
export default SearchBar;
