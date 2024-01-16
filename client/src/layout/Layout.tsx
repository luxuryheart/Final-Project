import PageContent from "../containers/PageContent"
import LeftSidebar from "../containers/LeftSidebar"

const Layout = () => {
  return (
    <>
        { /* Left drawer - containing page content and side bar (always open) */ }
        <div className="drawer  lg:drawer-open">
            <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
            <PageContent/>
            <LeftSidebar />
        </div>
    </>
  )
}

export default Layout