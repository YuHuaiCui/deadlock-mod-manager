import { Skeleton } from "@deadlock-mods/ui/components/skeleton";

const SearchBarSkeleton = () => {
  return (
    <div className='space-y-4'>
      {/* Row 1: Full-width search bar */}
      <Skeleton className='h-10 w-full' />

      {/* Row 2: Filter toolbar */}
      <div className='flex flex-wrap items-start gap-4 justify-between'>
        <div className='space-y-3 flex-1'>
          {/* Filters label */}
          <Skeleton className='h-5 w-16' />
          <div className='flex flex-wrap items-center gap-3'>
            {/* Categories button */}
            <Skeleton className='h-10 w-32' />
            {/* Heroes button */}
            <Skeleton className='h-10 w-28' />
            {/* Separator */}
            <Skeleton className='h-8 w-px' />
            {/* Mode select */}
            <Skeleton className='h-10 w-32' />
            {/* Separator */}
            <Skeleton className='h-8 w-px' />
            {/* Audio toggle */}
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-9' />
              <Skeleton className='h-4 w-24' />
            </div>
            {/* NSFW toggle */}
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-9' />
              <Skeleton className='h-4 w-24' />
            </div>
            {/* Outdated toggle */}
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-9' />
              <Skeleton className='h-4 w-20' />
            </div>
          </div>
        </div>

        {/* Sort section */}
        <div className='space-y-3'>
          <Skeleton className='h-5 w-16' />
          <Skeleton className='h-10 w-[200px]' />
        </div>
      </div>
    </div>
  );
};

export default SearchBarSkeleton;
