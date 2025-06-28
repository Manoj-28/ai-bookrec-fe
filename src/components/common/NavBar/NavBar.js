import React, { useState } from "react";
import { Profile } from "./profile";
import "./NavBar.css";

export const NavBar = ({ isProfileOpen, setProfileOpen }) => {
	const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isSearchOpen, setSearchOpen] = useState(false);


	const toggleMobileMenu = () => {
		setMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleSearch = () => {
		setSearchOpen(!isSearchOpen);
	};



	return (
		<div id="webcrumbs">
			<div className="h-auto bg-white border-b border-gray-200 flex flex-row md:flex-row lg:flex-row items-center justify-between px-4 md:px-6 lg:px-8 relative">
				<div id="menu" className="w-full flex items-center justify-between md:w-auto py-4 md:py-0">
					<a href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600 transition duration-300 transform hover:scale-105 active:scale-95">
					BooksByAI
					</a>
					<button
						className={`${isMobileMenuOpen ? 'hidden' : 'block'} md:hidden text-gray-600 hover:text-gray-900 transition-colors duration-300 active:scale-95 p-2 rounded-md hover:bg-gray-100`}
						onClick={toggleMobileMenu}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
					<button
						className={`${isMobileMenuOpen ? 'block' : 'hidden'} text-gray-600 hover:text-gray-900 transition-colors duration-300 active:scale-95 p-2 rounded-md hover:bg-gray-100`}
						onClick={toggleMobileMenu}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div id="mobileMenu" style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
					className=" md:flex flex-row md:flex-row lg:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 pb-4 md:pb-0 absolute md:static top-full left-0 right-0 bg-white z-50 border-t md:border-t-0 border-gray-100">


					<div className="md:hidden px-4 py-2 w-full">
						<div className="relative">
							<input type="text" placeholder="Search..." className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" />
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute top-2.5 left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>

					<nav className="flex flex-col md:flex-row lg:flex-row items-center space-y-0 md:space-y-0 md:space-x-4 lg:space-x-6 w-full md:w-auto">
						<a href="/" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full md:w-auto text-left px-4 md:px-0 py-4 md:py-0 border-b md:border-b-0 border-gray-100">Home</a>
						{/* <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full md:w-auto text-left px-4 md:px-0 py-4 md:py-0 border-b md:border-b-0 border-gray-100">Shop</a> */}
						<a href="/results" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full md:w-auto text-left px-4 md:px-0 py-4 md:py-0 border-b md:border-b-0 border-gray-100">Books</a>
						<a href="/bookmarks" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full md:w-auto text-left px-4 md:px-0 py-4 md:py-0 border-b md:border-b-0 border-gray-100">Bookmark</a>						
						{/* <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full md:w-auto text-left px-4 md:px-0 py-4 md:py-0 border-b md:border-b-0 border-gray-100">Membership</a> */}
					</nav>

					<div className="md:hidden flex justify-between w-full">
						<button className="text-gray-600 hover:text-gray-900 transition-colors duration-300 relative group p-1.5 rounded-full hover:bg-gray-100 active:scale-95 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
							{/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform transition-transform group-hover:scale-110">0</span> */}
						</button>
						<Profile />
					</div>
				</div>
				{/* <div className="hidden md:block md:flex lg:flex items-center space-y-0 md:space-y-0 md:space-x-3 lg:space-x-6 mt-0 md:mt-0 md:ml-4 lg:ml-6 w-full md:w-auto justify-between px-4 md:px-0 py-4 md:py-0 border-t md:border-t-0 border-gray-100"> */}

				<div id="nav"className="md:w-full  hidden md:flex relative group lg:flex items-center space-y-0 md:space-y-0 md:space-x-3 lg:space-x-6 mt-0 md:mt-0 md:ml-4 lg:ml-6  px-4 md:px-0 py-4 md:py-0 border-t md:border-t-0 border-gray-100 justify-center">


					{/* Navigation Links */}
					<nav className="flex items-center">
						<a href="/" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full text-left px-4 py-4 border-b border-gray-100">Home</a>
						{/* <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full text-left px-4 py-4 border-b border-gray-100">Shop</a> */}
						<a href="/results" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full text-left px-4 py-4 border-b border-gray-100">Books</a>						
						<a href="/bookmarks" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full text-left px-4 py-4 border-b border-gray-100">Bookmark</a>
						{/* <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300 text-sm font-medium hover:underline w-full text-left px-4 py-4 border-b border-gray-100">Membership</a> */}
					</nav>

					<div className="absolute right-0 flex">
						{/* <button
							className="text-gray-600 hover:text-gray-900 transition-colors duration-300 flex items-center p-1.5 rounded-full px-4 hover:bg-gray-100 active:scale-95"
							onClick={toggleSearch}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</button> */}
						{/* {isSearchOpen && (
							<div className="absolute left-0 md:left-auto md:right-0 mt-2 w-full md:w-64 bg-white shadow-lg rounded-md py-2 px-3 z-[100] border border-gray-100">
								<div className="relative">
									<input type="text" placeholder="Search..." className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm" />
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute top-2.5 left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
							</div>
						)} */}
						<a href="/bookmarks" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 group p-1.5 rounded-full hover:bg-gray-100 px-4 active:scale-95 w-auto md:w-auto flex">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
							{/* <span className="-top-2 -right-2 md:-top-2 md:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center transform transition-transform group-hover:scale-110">0</span> */}
						</a>


						{/* Profile Icon (Visible only in desktop view) */}
						<Profile isProfileOpen={isProfileOpen} setProfileOpen={setProfileOpen} className="px-4"/>
					</div>

				</div>


				{/* </div> */}
			</div>
		</div>
	);
};