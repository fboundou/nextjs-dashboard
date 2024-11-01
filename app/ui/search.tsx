"use client"; // This is a Client Component, which means you can use event listeners and hooks.

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

/*
Here's a quick overview of the implementation steps:

1. Capture the user's input.
2. Update the URL with the search params.
3. Keep the URL in sync with the input field.
4. Update the table to reflect the search query.
*/
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // use to get the current path (URL)
  const { replace } = useRouter();

  // This function will wrap the contents of handleSearch, and only run the code after a specific time once the user has stopped typing (300ms).
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    // URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters.
    // Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a.
    const params = new URLSearchParams(searchParams); // I. Capture the user's input.
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    /*
      Here's a breakdown of what's happening:
      1. ${pathname} is the current path, in your case, "/dashboard/invoices".
      2. As the user types into the search bar, params.toString() translates this input into a URL-friendly format.
      3. replace(${pathname}?${params.toString()}) updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "Lee".
      The URL is updated without reloading the page, thanks to Next.js's client-side navigation (which you learned about in the chapter on navigating between pages.
    */
    replace(`${pathname}?${params.toString()}`); // II. Update the URL with the search params.
  }, 300);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

/*
To ensure the input field is in sync with the URL and will be populated when sharing, 
you can pass a defaultValue to input by reading from searchParams:

defaultValue vs. value / Controlled vs. Uncontrolled

If you're using state to manage the value of an input, you'd use the value attribute to make it a controlled component. 
This means React would manage the input's state.

However, since you're not using state, you can use defaultValue. This means the native input will manage its own state. 
This is okay since you're saving the search query to the URL instead of state.
--------------------------------

When to use the useSearchParams() hook vs. the searchParams prop?

You might have noticed you used two different ways to extract search params. Whether you use one or the other depends on whether you're working on the client or the server.

  <Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
   <Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.
As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.

----------------------------

Summary
Congratulations! You've just implemented search and pagination using URL Params and Next.js APIs.
To summarize, in this chapter:
You've handled search and pagination with URL search parameters instead of client state.
You've fetched data on the server.
You're using the useRouter router hook for smoother, client-side transitions.
These patterns are different from what you may be used to when working with client-side React, 
but hopefully, you now better understand the benefits of using URL search params and lifting this state to the server.
*/
