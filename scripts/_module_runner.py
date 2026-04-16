from pathlib import Path
import runpy
import sys

ROOT = Path(__file__).resolve().parents[1]
BACKEND_ROOT = ROOT / "backend"


def run_backend_module(module_name: str) -> None:
    if str(BACKEND_ROOT) not in sys.path:
        sys.path.insert(0, str(BACKEND_ROOT))
    runpy.run_module(module_name, run_name="__main__")
