// react-intro/src/Pagination.jsx

export default function Pagination({
    page,
    total,
    perPage,
    onPage,
    onPerPage,
}) {
    const pages = Math.max(1, Math.ceil(total / perPage));

    const prev = () => {
        onPage(Math.max(1, page - 1));
    };

    const next = () => {
        onPage(Math.min(pages, page + 1));
    };

    return (
        <div className="pagination">
            <div className="pagination-navigation">
                <button type="button" onClick={prev} disabled={page <= 1}>
                    ← Prev
                </button>

                <span>
                    {String(page).padStart(2, '0')}
                    {' / '}
                    {String(pages).padStart(2, '0')}
                </span>

                <button type="button" onClick={next} disabled={page >= pages}>
                    Next →
                </button>
            </div>

            <label className="per-page">
                <span>Show</span>

                <select
                    value={perPage}
                    onChange={(event) => onPerPage(Number(event.target.value))}
                >
                    {[5, 10, 20].map((number) => (
                        <option key={number} value={number}>
                            {number}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
