export const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="logo">U.</div>
      <nav>
        <button>
          <i className="fas fa-home"></i>
        </button>
        <button>
          <i className="fas fa-bell"></i>
        </button>
        <button>
          <i className="fas fa-heart"></i>
        </button>
        <button>
          <i className="fas fa-cog"></i>
        </button>
      </nav>
    </div>
  );
};
