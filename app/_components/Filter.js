"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filter()
{
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("capacity") ?? "all";


  function HandleFilter(filter)
  {
    const params = new URLSearchParams(searchParams)
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, {scroll:false});
  }

  return(
    <div className="
      border 
      border-primary-800
      flex"
    >
      <Button 
        filter="all" 
        HandleFilter={HandleFilter} 
        activeFilter={activeFilter}
      >
        All cabins
      </Button>

      <Button 
        filter="small" 
        HandleFilter={HandleFilter} 
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </Button>

      <Button 
        filter="medium" 
        HandleFilter={HandleFilter} 
        activeFilter={activeFilter}
      >
        4&mdash;7 guests
      </Button>

      <Button 
        filter="large" 
        HandleFilter={HandleFilter} 
        activeFilter={activeFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  )
}

function Button({filter, HandleFilter, activeFilter, children})
{
  return(
    <button 
      className={`
        px-5 
        py-2 
        hover:bg-primary-700
        ${filter === activeFilter 
          ? "bg-primary-700 text-primary-50" 
          : ""
        }` 
      }
      onClick={() => HandleFilter(filter)}
    >
      {children}
    </button>
  );
}