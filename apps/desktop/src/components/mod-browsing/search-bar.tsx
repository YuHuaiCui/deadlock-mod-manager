import type { ModDto } from "@deadlock-mods/shared";
import { Badge } from "@deadlock-mods/ui/components/badge";
import { Button } from "@deadlock-mods/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@deadlock-mods/ui/components/command";
import { Input } from "@deadlock-mods/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@deadlock-mods/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@deadlock-mods/ui/components/select";
import { Separator } from "@deadlock-mods/ui/components/separator";
import { Switch } from "@deadlock-mods/ui/components/switch";
import {
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  CircleAlert,
  Eye,
  EyeOff,
  Filter,
  FolderOpen,
  Search,
  Users,
  Volume2,
  X,
} from "@deadlock-mods/ui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MOD_CATEGORY_ORDER, ModCategory, SortType } from "@/lib/constants";
import type { FilterMode } from "@/lib/store/slices/ui";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  query: string;
  setQuery: (query: string) => void;
  sortType: SortType;
  setSortType: (sortType: SortType) => void;
  mods: ModDto[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedHeroes: string[];
  onHeroesChange: (heroes: string[]) => void;
  hideNSFW: boolean;
  onHideNSFWChange: (hideNSFW: boolean) => void;
  hideAudio: boolean;
  onHideAudioChange: (hideAudio: boolean) => void;
  hideOutdated: boolean;
  onHideOutdatedChange: (hideOutdated: boolean) => void;
  filterMode: FilterMode;
  onFilterModeChange: (filterMode: FilterMode) => void;
};

const SearchBar = ({
  query,
  setQuery,
  sortType,
  setSortType,
  mods,
  selectedCategories,
  onCategoriesChange,
  selectedHeroes,
  onHeroesChange,
  hideNSFW,
  onHideNSFWChange,
  hideAudio,
  onHideAudioChange,
  hideOutdated,
  onHideOutdatedChange,
  filterMode,
  onFilterModeChange,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [heroOpen, setHeroOpen] = useState(false);

  // --- Category logic (from category-filter.tsx) ---
  const modsWithCategories = new Set(
    mods.map((mod) => mod.category).filter(Boolean),
  );
  const availableCategories = MOD_CATEGORY_ORDER.filter((category) =>
    modsWithCategories.has(category),
  );
  const predefinedCategories = Object.values(ModCategory);
  const hasOtherMods = Array.from(modsWithCategories).some(
    (category) => !predefinedCategories.includes(category as ModCategory),
  );
  const allCategories =
    hasOtherMods && !availableCategories.includes(ModCategory.OTHER_MISC)
      ? [...availableCategories, ModCategory.OTHER_MISC]
      : availableCategories;

  const handleCategoryToggle = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newSelected);
  };

  // --- Hero logic (from hero-filter.tsx) ---
  const availableHeroes = Array.from(
    new Set(
      mods
        .map((mod) => mod.hero)
        .filter((hero): hero is string => Boolean(hero)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const hasNonHeroMods = mods.some((mod) => !mod.hero);
  if (hasNonHeroMods && !availableHeroes.includes("None")) {
    availableHeroes.unshift("None");
  }

  const handleHeroToggle = (hero: string) => {
    const newSelected = selectedHeroes.includes(hero)
      ? selectedHeroes.filter((h) => h !== hero)
      : [...selectedHeroes, hero];
    onHeroesChange(newSelected);
  };

  // --- Display helpers ---
  const getHeroDisplayName = (hero: string) => {
    if (hero === "None") return "General/Other";
    return hero;
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case ModCategory.GAMEPLAY_MODIFICATIONS:
        return "Gameplay";
      case ModCategory.MODEL_REPLACEMENT:
        return "Models";
      case ModCategory.OTHER_MISC:
        return "Other";
      default:
        return category;
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    onCategoriesChange(
      selectedCategories.filter((cat) => cat !== categoryToRemove),
    );
  };

  const removeHero = (heroToRemove: string) => {
    onHeroesChange(selectedHeroes.filter((hero) => hero !== heroToRemove));
  };

  const clearAllFilters = () => {
    onCategoriesChange([]);
    onHeroesChange([]);
    onHideNSFWChange(false);
    onHideAudioChange(false);
    onHideOutdatedChange(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedHeroes.length > 0 ||
    hideNSFW ||
    hideAudio ||
    hideOutdated;

  const totalActiveFilters =
    selectedCategories.length +
    selectedHeroes.length +
    (hideNSFW ? 1 : 0) +
    (hideAudio ? 1 : 0) +
    (hideOutdated ? 1 : 0);

  return (
    <div className='space-y-4'>
      {/* Row 1: Full-width search bar */}
      <div className='relative'>
        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          className='pl-9 pr-9'
          placeholder={t("mods.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type='button'
            className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            onClick={() => setQuery("")}>
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Row 2: Filter toolbar */}
      <div className='flex flex-wrap items-start gap-4 justify-between'>
        {/* Left side: Filters */}
        <div className='space-y-3 flex-1'>
          <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
            <Filter className='h-4 w-4' />
            <span>{t("filters.filters")}</span>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            {/* Categories Popover */}
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    "justify-between",
                    selectedCategories.length > 0 &&
                      "border-primary/50 bg-primary/5",
                  )}>
                  <FolderOpen className='mr-2 h-4 w-4' />
                  {t("filters.category")}
                  {selectedCategories.length > 0 && (
                    <Badge className='ml-2 h-5 px-1.5' variant='secondary'>
                      {selectedCategories.length}
                    </Badge>
                  )}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[240px] p-0' align='start'>
                <Command>
                  <CommandInput placeholder={t("filters.searchCategories")} />
                  <CommandList>
                    <CommandEmpty>
                      {t("filters.noCategoriesFound")}
                    </CommandEmpty>
                    <CommandGroup>
                      {allCategories.map((category) => (
                        <CommandItem
                          key={category}
                          onSelect={() => handleCategoryToggle(category)}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-shrink-0",
                              selectedCategories.includes(category)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className='truncate'>{category}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Heroes Popover */}
            <Popover open={heroOpen} onOpenChange={setHeroOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    "justify-between",
                    selectedHeroes.length > 0 &&
                      "border-primary/50 bg-primary/5",
                  )}>
                  <Users className='mr-2 h-4 w-4' />
                  {t("filters.hero")}
                  {selectedHeroes.length > 0 && (
                    <Badge className='ml-2 h-5 px-1.5' variant='secondary'>
                      {selectedHeroes.length}
                    </Badge>
                  )}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[240px] p-0' align='start'>
                <Command>
                  <CommandInput placeholder={t("filters.searchHeroes")} />
                  <CommandList>
                    <CommandEmpty>{t("filters.noHeroesFound")}</CommandEmpty>
                    <CommandGroup>
                      {availableHeroes.map((hero) => (
                        <CommandItem
                          key={hero}
                          onSelect={() => handleHeroToggle(hero)}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-shrink-0",
                              selectedHeroes.includes(hero)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className='truncate'>
                            {getHeroDisplayName(hero)}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Separator orientation='vertical' className='h-8' />

            {/* Mode Select */}
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {t("filters.mode")}:
              </span>
              <Select
                value={filterMode}
                onValueChange={(value) =>
                  onFilterModeChange(value as FilterMode)
                }>
                <SelectTrigger className='w-[120px]'>
                  <SelectValue placeholder={t("filters.mode")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='include'>
                    <div className='flex items-center gap-2'>
                      <Eye className='h-4 w-4' />
                      {t("filters.include")}
                    </div>
                  </SelectItem>
                  <SelectItem value='exclude'>
                    <div className='flex items-center gap-2'>
                      <EyeOff className='h-4 w-4' />
                      {t("filters.exclude")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator orientation='vertical' className='h-8' />

            {/* Audio Mods toggle */}
            <label className='flex cursor-pointer items-center gap-2 text-sm'>
              <Switch checked={hideAudio} onCheckedChange={onHideAudioChange} />
              <Volume2 className='h-4 w-4 text-muted-foreground' />
              {t("filters.excludeAudioMods")}
            </label>

            {/* NSFW Mods toggle */}
            <label className='flex cursor-pointer items-center gap-2 text-sm'>
              <Switch checked={hideNSFW} onCheckedChange={onHideNSFWChange} />
              <CircleAlert className='h-4 w-4 text-muted-foreground' />
              {t("filters.hideNSFW")}
            </label>

            {/* Hide Outdated toggle */}
            <label className='flex cursor-pointer items-center gap-2 text-sm'>
              <Switch
                checked={hideOutdated}
                onCheckedChange={onHideOutdatedChange}
              />
              {t("filters.hideOutdated")}
            </label>

            {/* Clear All */}
            {hasActiveFilters && (
              <>
                <Separator orientation='vertical' className='h-8' />
                <Button variant='ghost' size='sm' onClick={clearAllFilters}>
                  <X className='mr-2 h-4 w-4' />
                  {t("filters.clearAll")} ({totalActiveFilters})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Right side: Sort */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
            <ArrowDownWideNarrow className='h-4 w-4' />
            <span>{t("filters.sortBy")}</span>
          </div>

          <Select onValueChange={setSortType} value={sortType}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder={t("filters.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(SortType).map((type) => (
                  <SelectItem className='capitalize' key={type} value={type}>
                    {t(`sorting.${type.replaceAll(/\s+/g, "").toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3: Active filter tags */}
      {hasActiveFilters && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-muted-foreground text-sm'>
            {filterMode === "include"
              ? t("filters.includingFilters")
              : t("filters.excludingFilters")}
          </span>

          {selectedCategories.map((category) => (
            <Badge
              className='flex items-center gap-1'
              key={`category-${category}`}
              variant='secondary'>
              {t("filters.categoryLabel")} {getCategoryDisplayName(category)}
              <button
                className='ml-1 rounded-full p-0.5 hover:bg-muted'
                onClick={() => removeCategory(category)}
                type='button'>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          ))}

          {selectedHeroes.map((hero) => (
            <Badge
              className='flex items-center gap-1'
              key={`hero-${hero}`}
              variant='secondary'>
              {t("filters.heroLabel")} {getHeroDisplayName(hero)}
              <button
                className='ml-1 rounded-full p-0.5 hover:bg-muted'
                onClick={() => removeHero(hero)}
                type='button'>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          ))}

          {hideNSFW && (
            <Badge className='flex items-center gap-1' variant='destructive'>
              {t("filters.hideNSFW")}
              <button
                className='ml-1 rounded-full p-0.5 hover:bg-muted'
                onClick={() => onHideNSFWChange(false)}
                type='button'>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}

          {hideAudio && (
            <Badge className='flex items-center gap-1' variant='secondary'>
              {t("filters.hideAudio")}
              <button
                className='ml-1 rounded-full p-0.5 hover:bg-muted'
                onClick={() => onHideAudioChange(false)}
                type='button'>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}

          {hideOutdated && (
            <Badge className='flex items-center gap-1' variant='secondary'>
              {t("filters.hideOutdated")}
              <button
                className='ml-1 rounded-full p-0.5 hover:bg-muted'
                onClick={() => onHideOutdatedChange(false)}
                type='button'>
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
