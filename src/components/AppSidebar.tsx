import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  // SidebarTrigger,
} from "./ui/sidebar";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import { DumbbellIcon, Gauge, PanelLeftCloseIcon } from "lucide-react";
import { SignOutButton } from "@clerk/clerk-react";

const links = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Exercises",
    url: "/exercises",
    icon: DumbbellIcon,
  },
  {
    title: "Weight",
    url: "/weight",
    icon: Gauge,
  },
  {
    title: "Account",
    url: "/account",
    icon: PersonIcon,
  },
];

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <>
      <Sidebar collapsible="offcanvas" variant="floating" className="">
        <SidebarContent className="">
          <SidebarHeader className="">
            <PanelLeftCloseIcon
              size={22}
              className="cursor-pointer"
              onClick={toggleSidebar}
            />
            <p className="text-center text-4xl font-bold">FitLogger</p>
            <span className="text-center text-sm font-light">
              Log your workouts with ease
            </span>
          </SidebarHeader>
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-sm mb-2">
              Pages
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarFooter>
            <SignOutButton />
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      {/* <SidebarTrigger className="my-2 rounded-sm px-2" /> */}
    </>
  );
  // return (
  // <aside className="grid-sidebar bg-gray-50 p-8 border-r-4 border-red-200">
  //   <div className="text-center">
  //     <NavLink
  //       to="/dashboard"
  //       className="block text-4xl font-bold text-red-900 my-4"
  //     >
  //       FitLogger
  //     </NavLink>
  //     <span className="text-sm tracking-wider">
  //       Track your workouts like a pro
  //     </span>
  //   </div>
  //   <hr className="my-8" />
  //   <nav className="my-8">
  //     <ul className="flex flex-col gap-2 text-lg">
  //       <li className="">
  //         <NavLink
  //           to="/dashboard"
  //           className={({ isActive }) =>
  //             (isActive ? "bg-red-100 font-semibold " : "") +
  //             "block px-3 py-1 rounded-lg"
  //           }
  //         >
  //           Dashboard
  //         </NavLink>
  //       </li>
  //       <li className="">
  //         <NavLink
  //           to="/exercises"
  //           className={({ isActive }) =>
  //             (isActive ? "bg-red-100 font-semibold " : "") +
  //             "block px-3 py-1 rounded-lg"
  //           }
  //         >
  //           Exercises
  //         </NavLink>
  //       </li>
  //       <li className="">
  //         <NavLink
  //           to="/weight"
  //           className={({ isActive }) =>
  //             (isActive ? "bg-red-100 font-semibold " : "") +
  //             "block px-3 py-1 rounded-lg"
  //           }
  //         >
  //           Weight
  //         </NavLink>
  //       </li>
  //       <li className="">
  //         <NavLink
  //           to="/account"
  //           className={({ isActive }) =>
  //             (isActive ? "bg-red-100 font-semibold " : "") +
  //             "block px-3 py-1 rounded-lg"
  //           }
  //         >
  //           Account
  //         </NavLink>
  //       </li>
  //     </ul>
  //   </nav>
  // </aside>
  // );
};

export default AppSidebar;
