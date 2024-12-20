export class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //BUILD QUERY create copy for filtering, remove unwanted fields from query
        const queryObj = {...this.queryString};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(field => delete queryObj[field]);

        //advanced filtering
        const queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // let query = Tour.find(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' '); //accept more params in query [-price, -ratingAverage]
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt'); //default sort
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const limiting = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(limiting); //default sort
        } else {
            this.query = this.query.select('-__v'); //defaultly excludes __v field from document
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}