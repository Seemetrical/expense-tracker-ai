'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Property, TransactionFilters, SortField, SortOrder } from '@/types/property';
import { PAGE_SIZE } from '@/constants/filters';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTransactions(filters: TransactionFilters) {
  const [sortField, setSortField] = useState<SortField>('contractDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  if (filters.district) params.set('district', filters.district);
  if (filters.propertyType) params.set('propertyType', filters.propertyType);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);

  const { data, error, isLoading } = useSWR<{ records: Property[]; total: number }>(
    `/api/transactions?${params}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const filtered = useMemo(() => {
    if (!data?.records) return [];
    let list = data.records;

    // Client-side text search (street/project)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.street.toLowerCase().includes(q) ||
          r.project.toLowerCase().includes(q),
      );
    }

    // Tenure filter
    if (filters.tenure) {
      list = list.filter((r) => r.tenureNormalized === filters.tenure);
    }

    // Sale type filter
    if (filters.typeOfSale) {
      list = list.filter((r) => r.typeOfSale === filters.typeOfSale);
    }

    // Sort
    list = [...list].sort((a, b) => {
      let av: number | string, bv: number | string;
      switch (sortField) {
        case 'contractDate': av = a.contractDateParsed; bv = b.contractDateParsed; break;
        case 'price': av = a.priceSgd; bv = b.priceSgd; break;
        case 'area': av = a.areaSqft; bv = b.areaSqft; break;
        case 'psf': av = a.psf; bv = b.psf; break;
        case 'district': av = a.district; bv = b.district; break;
        case 'propertyType': av = a.propertyType; bv = b.propertyType; break;
        default: return 0;
      }
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [data?.records, filters.search, filters.tenure, filters.typeOfSale, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  }

  return {
    records: paginated,
    total: filtered.length,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
    sortField,
    sortOrder,
    handleSort,
  };
}
