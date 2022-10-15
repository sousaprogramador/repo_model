import { FindConditions, FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';

type IPaginationOptions = {
    limit?: number;
    page?: number;
}

type ExtendedIPaginationOptions = Required<IPaginationOptions> & {
    skipNumber: number;
    takeNumber: number;
}

type IPaginatedMeta = {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

type IPaginated<T> = {
    items: T[];
    meta: IPaginatedMeta;
}

class IPagination {
    static readonly DEFAULT_PAGE = 1;
    static readonly DEFAULT_LIMIT = 10;

    private static async sanitizeOptions(options?: IPaginationOptions): Promise<ExtendedIPaginationOptions> {
        let page: number;
        let limit: number;

        if (!options) {
            page = this.DEFAULT_PAGE;
            limit = this.DEFAULT_LIMIT;
        } else {
            if (!options.page || options.page < 1) options.page = this.DEFAULT_PAGE;
            if (!options.limit || options.limit < 1) options.limit = this.DEFAULT_LIMIT;
        }

        const result: ExtendedIPaginationOptions = {
            page: options.page,
            limit: options.limit,
            skipNumber: (options.limit * (options.page - 1)),
            takeNumber: options.limit,
        }

        return result;
    }

    private static async generateMeta(options: ExtendedIPaginationOptions, itemsLength: number, total: number): Promise<IPaginatedMeta> {
        const meta: IPaginatedMeta = {
            itemCount: itemsLength,
            totalItems: total,
            itemsPerPage: options.limit,
            totalPages: Math.ceil(total / options.limit),
            currentPage: options.page,
        }

        return meta;
    }

    public static async paginate<T>(query: SelectQueryBuilder<T>, options?: IPaginationOptions): Promise<IPaginated<T>>;
    public static async paginate<T>(query: Repository<T>, options?: IPaginationOptions, searchOptions?: FindConditions<T> | FindManyOptions<T>): Promise<IPaginated<T>>;
    public static async paginate<T>(query: SelectQueryBuilder<T> | Repository<T>, options?: IPaginationOptions, searchOptions?: FindConditions<T> | FindManyOptions<T>): Promise<IPaginated<T>> {
        const paginationData = await this.sanitizeOptions(options);

        if (query instanceof SelectQueryBuilder) {
            const metaQuery: SelectQueryBuilder<T> = query.clone();

            const items = await query
                .skip(paginationData.skipNumber)
                .take(paginationData.takeNumber)
                .getMany();

            const total = await metaQuery.getCount();
            const meta = await this.generateMeta(paginationData, items.length, total);
            const result: IPaginated<T> = { items, meta };

            return result;
        }

        if (query instanceof Repository) {
            const [items, total] = await query.findAndCount({
                skip: paginationData.skipNumber,
                take: paginationData.takeNumber,
                ...searchOptions,
            });

            const meta = await this.generateMeta(paginationData, items.length, total);
            const result: IPaginated<T> = { items, meta };

            return result;
        }
    }
}

export {
    IPagination,
    IPaginationOptions,
    IPaginated,
};